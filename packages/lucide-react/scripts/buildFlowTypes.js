import path from 'path';
import {
  appendFile,
  readSvgDirectory,
  resetFile,
  toPascalCase,
  writeFile,
} from '../../../scripts/helpers';

const srcDirectory = path.join(__dirname, '../dist/cjs');

// Declare type definitions
const typeDefinitions = `\
// @flow

export type LucideProps = {
  size?: string | number,
  color?: string,
  strokeWidth?: number,
  className?: string,
}

declare export var createReactComponent: (iconName: string, iconNode: any[]) => (props: LucideProps) => React$Node;

export type Icon = React$StatelessFunctionalComponent<LucideProps>;

// Generated icons
`;

const ICONS_DIR = path.resolve(__dirname, '../../../icons');
const TYPES_FILE = 'lucide-react.js.flow';

resetFile(TYPES_FILE, srcDirectory);
writeFile(typeDefinitions, TYPES_FILE, srcDirectory);

const svgFiles = readSvgDirectory(ICONS_DIR);

svgFiles.forEach(svgFile => {
  const iconName = path.basename(svgFile, '.svg');
  const componentName = toPascalCase(iconName);

  const exportTypeString = `declare export var ${componentName}: (props: LucideProps) => React$Node;\n`;
  appendFile(exportTypeString, TYPES_FILE, srcDirectory);
});

console.log(`Generated ${TYPES_FILE} file with`, svgFiles.length, 'icons');
