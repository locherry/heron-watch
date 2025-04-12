import { FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const IconLibraries = {
  "MaterialIcons": MaterialIcons,
  "FontAwesome": FontAwesome,
  "FontAwesome6": FontAwesome6,
  "MaterialCommunityIcons" : MaterialCommunityIcons
}

export type IconLibraryType = (typeof IconLibraries)[keyof typeof IconLibraries]
export type IconLibraryName = keyof typeof IconLibraries
export type SFSymbol = import('expo-symbols').SymbolViewProps['name']

type IconMapping<T extends React.ElementType> = Partial<Record<
  SFSymbol,
  React.ComponentProps<T>['name']
>>;

export const MAPPING = {
  // See MaterialIcons here: https://icons.expo.fyi
  // See SF Symbols in the SF Symbols app on Mac or here :  http://github.com/andrewtavis/sf-symbols-online/blob/master/README_dark.md 
  MaterialIcons: {
    'house.fill': 'home',
    'paperplane.fill': 'send',
    'chevron.left.forwardslash.chevron.right': 'code',
    'chevron.right': 'chevron-right',
    'chevron.left': 'chevron-left',
    'tag.fill':'sell',
    'pencil' : 'edit',
    'rectangle.portrait.and.arrow.right' : 'logout',
    'paintpalette' : 'palette'
  } satisfies IconMapping<typeof MaterialIcons>,
  FontAwesome: {
    'exclamationmark.circle.fill': "exclamation-circle",
    'xmark.circle.fill' : 'times-circle',
    'info.circle.fill' : 'info-circle',
    'checkmark.circle.fill' : 'check-circle',    
    'circle.fill' : 'circle',
    'questionmark.circle' : 'question-circle',
    'viewfinder.rectangular' : 'qrcode',
    'character.bubble' : 'language',
    'person.crop.circle' : 'user-circle-o',
    'envelope' : 'envelope-o',
  } satisfies IconMapping<typeof FontAwesome>,
  FontAwesome6: {
    'rectangle.stack': "cubes-stacked",
  } satisfies IconMapping<typeof FontAwesome6>,
  MaterialCommunityIcons: {
    'line.3.horizontal.decrease': 'filter',
    'trash':'delete',
    'arrow.right.arrow.left':'transfer',
    'gift.fill' : 'gift',
    'gear': 'cog',
    'chart.pie': 'chart-pie',
    'ellipsis' : 'dots-horizontal',
    'moon.fill' : 'moon-waning-crescent',
    'sun.max.fill' : 'white-balance-sunny',
  } satisfies IconMapping<typeof MaterialCommunityIcons>,
} satisfies Record<
  IconLibraryName,
  IconMapping<IconLibraryType>
>;

// Define the IconSymbolName type by extracting keys from all icon mappings
export type IconSymbolName = {
  [K in IconLibraryName]: keyof typeof MAPPING[K]
}[IconLibraryName];
