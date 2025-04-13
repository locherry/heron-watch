import { FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const IconLibraries = {
  "MaterialCommunityIcons": MaterialCommunityIcons,
  // "FontAwesome": FontAwesome,
  // "FontAwesome6": FontAwesome6,
}

export type IconLibraryType = (typeof IconLibraries)[keyof typeof IconLibraries]
export type IconLibraryName = keyof typeof IconLibraries
export type SFSymbol = import('expo-symbols').SymbolViewProps['name']

type IconMapping<T extends React.ElementType> = Partial<Record<
  SFSymbol,
  React.ComponentProps<T>['name']
>>;



// See MaterialCommunityIcons here: https://icons.expo.fyi
// See SF Symbols in the SF Symbols app on Mac or here :  http://github.com/andrewtavis/sf-symbols-online/blob/master/README_dark.md 
export const MAPPING = {
  /* 
  /!\ Try to stick with the minimum icon library to be more efficient
  */
  MaterialCommunityIcons: {
    // for alerts
    'exclamationmark.circle.fill': "alert-circle",
    'xmark.circle.fill': 'close-circle',
    'info.circle.fill': 'information',
    'checkmark.circle.fill': 'check-circle',
    'circle.fill': 'circle',
    'questionmark.circle': 'help-circle',

    // Tabbar Icons
    'house.fill': 'home',
    'house': 'home-outline',
    'gearshape.fill': 'cog',
    'gearshape': 'cog-outline',
    'shield.fill': 'shield',
    'shield': 'shield-outline',

    //settings icons
    'person.crop.circle': 'account',
    'envelope': 'email-outline',
    'character.bubble': 'translate',
    'chevron.right': 'chevron-right',
    'rectangle.portrait.and.arrow.right': 'logout',
    'paintpalette': 'palette',
    'moon.fill': 'moon-waning-crescent',
    'sun.max.fill': 'white-balance-sunny',

    //action icons
    'tag': 'tag-outline',
    'rectangle.stack': "package-variant",
    'arrow.right.arrow.left': 'transfer',
    'gift': 'gift-outline',
    'trash': 'trash-can-outline',
    'pencil': 'pencil',
    'ellipsis': 'dots-horizontal',

    // Miscellaneous
    'viewfinder.rectangular': 'qrcode',
    'chevron.left': 'chevron-left',

    // 'line.3.horizontal.decrease': 'filter',
    // 'chart.pie': 'chart-pie',
  } satisfies IconMapping<typeof MaterialCommunityIcons>,
  // FontAwesome: {
  //   // 'exclamationmark.circle.fill': "exclamation-circle",
  //   // 'xmark.circle.fill' : 'times-circle',
  //   // 'info.circle.fill' : 'info-circle',
  //   // 'checkmark.circle.fill' : 'check-circle',    
  //   // 'circle.fill' : 'circle',
  //   // 'questionmark.circle' : 'question-circle',
  // } satisfies IconMapping<typeof FontAwesome>,
  // FontAwesome6: {
  //   // 'rectangle.stack': "cubes-stacked",
  // } satisfies IconMapping<typeof FontAwesome6>,
} satisfies Record<
  IconLibraryName,
  IconMapping<IconLibraryType>
>;

// Define the IconSymbolName type by extracting keys from all icon mappings
export type IconSymbolName = {
  [K in IconLibraryName]: keyof typeof MAPPING[K]
}[IconLibraryName];
