import {captureRef} from 'react-native-view-shot';
import Share from 'react-native-share';
import {Alert} from 'react-native';
import RNFS from 'react-native-fs';

/**
 * Export canvas as PNG image
 */
export const exportAsPNG = async (
  viewRef: any,
  filename: string = 'mindmap'
): Promise<string | null> => {
  try {
    const uri = await captureRef(viewRef, {
      format: 'png',
      quality: 1,
      result: 'tmpfile',
    });

    // Move to documents directory
    const destPath = `${RNFS.DocumentDirectoryPath}/${filename}.png`;
    await RNFS.moveFile(uri, destPath);

    return destPath;
  } catch (error) {
    console.error('Failed to export PNG:', error);
    Alert.alert('Export Failed', 'Could not export image');
    return null;
  }
};

/**
 * Export canvas as JPEG image
 */
export const exportAsJPEG = async (
  viewRef: any,
  filename: string = 'mindmap',
  quality: number = 0.9
): Promise<string | null> => {
  try {
    const uri = await captureRef(viewRef, {
      format: 'jpg',
      quality,
      result: 'tmpfile',
    });

    const destPath = `${RNFS.DocumentDirectoryPath}/${filename}.jpg`;
    await RNFS.moveFile(uri, destPath);

    return destPath;
  } catch (error) {
    console.error('Failed to export JPEG:', error);
    Alert.alert('Export Failed', 'Could not export image');
    return null;
  }
};

/**
 * Share exported file
 */
export const shareFile = async (filePath: string, mimeType: string = 'image/png') => {
  try {
    await Share.open({
      url: `file://${filePath}`,
      type: mimeType,
      title: 'Share Mind Map',
    });
  } catch (error: any) {
    if (error.message !== 'User did not share') {
      console.error('Share failed:', error);
      Alert.alert('Share Failed', 'Could not share file');
    }
  }
};

/**
 * Export and share as PNG
 */
export const exportAndSharePNG = async (viewRef: any, filename: string = 'mindmap') => {
  const filePath = await exportAsPNG(viewRef, filename);

  if (filePath) {
    await shareFile(filePath, 'image/png');
  }
};

/**
 * Export and share as JPEG
 */
export const exportAndShareJPEG = async (
  viewRef: any,
  filename: string = 'mindmap',
  quality: number = 0.9
) => {
  const filePath = await exportAsJPEG(viewRef, filename, quality);

  if (filePath) {
    await shareFile(filePath, 'image/jpeg');
  }
};

/**
 * Simple PDF export (creates PDF from PNG)
 * Note: For production, you'd use a proper PDF library
 */
export const exportAsPDF = async (
  viewRef: any,
  filename: string = 'mindmap'
): Promise<string | null> => {
  try {
    // Capture as high-quality PNG first
    const pngUri = await captureRef(viewRef, {
      format: 'png',
      quality: 1,
      result: 'tmpfile',
    });

    // For a simple implementation, we'll just save as PNG
    // In production, you'd convert to PDF using a library
    const destPath = `${RNFS.DocumentDirectoryPath}/${filename}.pdf`;

    // Read PNG and write as PDF (simplified - in production use proper PDF library)
    const pngData = await RNFS.readFile(pngUri, 'base64');

    // This is a placeholder - you'd use react-native-pdf or similar
    // For now, we'll just copy the PNG
    await RNFS.copyFile(pngUri, destPath);

    return destPath;
  } catch (error) {
    console.error('Failed to export PDF:', error);
    Alert.alert('Export Failed', 'Could not export PDF');
    return null;
  }
};

/**
 * Batch export (multiple formats)
 */
export const batchExport = async (
  viewRef: any,
  filename: string = 'mindmap',
  formats: ('png' | 'jpeg' | 'pdf')[] = ['png']
) => {
  const results: Record<string, string | null> = {};

  for (const format of formats) {
    switch (format) {
      case 'png':
        results.png = await exportAsPNG(viewRef, filename);
        break;
      case 'jpeg':
        results.jpeg = await exportAsJPEG(viewRef, filename);
        break;
      case 'pdf':
        results.pdf = await exportAsPDF(viewRef, filename);
        break;
    }
  }

  return results;
};
