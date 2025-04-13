// This file is a fallback for using MaterialIcons on Android and web.

import { IconLibraries, IconLibraryName, IconSymbolName, MAPPING, SFSymbol } from '@/constants/Icons';
import { useThemeColor } from '@/hooks/color/useThemeColor';
import { FontAwesome } from '@expo/vector-icons';
import { SymbolWeight } from 'expo-symbols';
import React from 'react';
import { OpaqueColorValue, ViewProps } from 'react-native';


type Props = ViewProps & {
  name: IconSymbolName;
  size?: number;
  color?: string | OpaqueColorValue;
  weight?: SymbolWeight;
}
/**
 * An icon component that uses native SFSymbols on iOS, and some specific icon librairies (such as Fontawesome and MaterialIcons) on Android and web. This ensures a consistent look across platforms, and optimal resource usage.
 *
 * Icon `name`s are based on SFSymbols and require manual mapping to some specific icon librairies (such as Fontawesome and MaterialIcons).
 */

export function IconSymbol({
  name,
  size = 24,
  color,
}: Props) {
  const colors = useThemeColor()

  function findIconLibrary(iconName: SFSymbol): IconLibraryName | undefined {
    return (Object.keys(MAPPING) as IconLibraryName[]).find(
      lib => iconName in MAPPING[lib]
    );
  }

  const iconLibrary = findIconLibrary(name) ?? Object.keys(IconLibraries)[0] as IconLibraryName
  const IconComponent = IconLibraries[iconLibrary]
  
  // @ts-ignore
  // Yes TS detect it is not compatible, but it works
  const iconName = MAPPING[iconLibrary][name] as React.ComponentProps<
    typeof IconLibraries[typeof iconLibrary]
  >['name']; 

  //Error Handling
  if (!IconComponent || !iconName) {
    console.warn(`Icon "${name}" not found in library "${iconLibrary}"`);
    return <FontAwesome
      color={color ?? colors.gray900}
      size={size}
      name={'question-circle'}
    />
  }

  return <IconComponent
    color={color ?? colors.gray900}
    size={size}
    name={iconName}
  />
}