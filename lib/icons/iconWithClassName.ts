import type { LucideIcon } from 'lucide-react-native'; // Type for icons from lucide-react-native
import { cssInterop } from 'nativewind'; // Utility from nativewind to enable styling interoperability

/**
 * Enhance a LucideIcon component to support nativewind className styling for
 * color and opacity by mapping those styles to native style props.
 *
 * @param icon - The LucideIcon component to enhance
 */
export function iconWithClassName(icon: LucideIcon) {
  cssInterop(icon, {
    className: {
      // Target native style prop instead of the usual React Native style object
      target: 'style',

      // Map these CSS class properties to native style props to enable styling
      nativeStyleToProp: {
        color: true,   // Allow 'color' in className to control icon color
        opacity: true, // Allow 'opacity' in className to control icon transparency
      },
    },
  });
}
