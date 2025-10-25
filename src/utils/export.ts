import RNFS from 'react-native-fs';
import {Map, Node, Edge} from '../types';
import {Alert, Share} from 'react-native';

/**
 * Export functionality for PDF, PNG, and OPML formats
 */

// Export as OPML (Outline Processor Markup Language)
export const exportAsOPML = async (
  map: Map,
  nodes: Node[],
  edges: Edge[]
): Promise<string> => {
  const buildOutlineXML = (parentId?: string, indent: number = 0): string => {
    const children = nodes.filter(n => n.parentId === parentId);

    return children
      .map(node => {
        const hasChildren = nodes.some(n => n.parentId === node.id);
        const indentStr = '  '.repeat(indent + 2);

        if (hasChildren) {
          const childrenXML = buildOutlineXML(node.id, indent + 1);
          return `${indentStr}<outline text="${escapeXML(node.text)}">\n${childrenXML}${indentStr}</outline>`;
        } else {
          return `${indentStr}<outline text="${escapeXML(node.text)}" />`;
        }
      })
      .join('\n');
  };

  const opml = `<?xml version="1.0" encoding="UTF-8"?>
<opml version="2.0">
  <head>
    <title>${escapeXML(map.title)}</title>
    <dateCreated>${map.createdAt}</dateCreated>
    <dateModified>${map.updatedAt}</dateModified>
  </head>
  <body>
${buildOutlineXML()}
  </body>
</opml>`;

  const filePath = `${RNFS.DocumentDirectoryPath}/${map.title}.opml`;
  await RNFS.writeFile(filePath, opml, 'utf8');

  return filePath;
};

// Export as JSON (for backup/restore)
export const exportAsJSON = async (
  map: Map,
  nodes: Node[],
  edges: Edge[]
): Promise<string> => {
  const data = {
    map,
    nodes,
    edges,
    exportDate: new Date().toISOString(),
    version: '1.0',
  };

  const json = JSON.stringify(data, null, 2);
  const filePath = `${RNFS.DocumentDirectoryPath}/${map.title}.json`;
  await RNFS.writeFile(filePath, json, 'utf8');

  return filePath;
};

// Export as Text (simple outline format)
export const exportAsText = async (
  map: Map,
  nodes: Node[],
  edges: Edge[]
): Promise<string> => {
  const buildTextOutline = (parentId?: string, indent: number = 0): string => {
    const children = nodes.filter(n => n.parentId === parentId);

    return children
      .map(node => {
        const prefix = '  '.repeat(indent) + '- ';
        const childrenText = buildTextOutline(node.id, indent + 1);
        return prefix + node.text + (childrenText ? '\n' + childrenText : '');
      })
      .join('\n');
  };

  const text = `${map.title}\n${'='.repeat(map.title.length)}\n\n${buildTextOutline()}`;

  const filePath = `${RNFS.DocumentDirectoryPath}/${map.title}.txt`;
  await RNFS.writeFile(filePath, text, 'utf8');

  return filePath;
};

// Share exported file
export const shareFile = async (filePath: string) => {
  try {
    await Share.share({
      url: `file://${filePath}`,
      title: 'Share Mind Map',
    });
  } catch (error) {
    Alert.alert('Error', 'Failed to share file');
  }
};

// Helper function to escape XML special characters
const escapeXML = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

// Main export handler
export const handleExport = async (
  format: 'opml' | 'json' | 'text',
  map: Map,
  nodes: Node[],
  edges: Edge[]
) => {
  try {
    let filePath: string;

    switch (format) {
      case 'opml':
        filePath = await exportAsOPML(map, nodes, edges);
        break;
      case 'json':
        filePath = await exportAsJSON(map, nodes, edges);
        break;
      case 'text':
        filePath = await exportAsText(map, nodes, edges);
        break;
    }

    Alert.alert(
      'Export Successful',
      `File saved to: ${filePath}`,
      [
        {text: 'OK', style: 'cancel'},
        {
          text: 'Share',
          onPress: () => shareFile(filePath),
        },
      ]
    );
  } catch (error) {
    Alert.alert('Export Failed', 'An error occurred while exporting');
    console.error('Export error:', error);
  }
};
