import { ChartBar, Heart } from 'lucide-react-native';
import { TouchableOpacity, View } from 'react-native';

export default function Actions() {
  return (
    <View className="flex-row justify-between">
      <TouchableOpacity>
        <ChartBar size={24} color="white" fill="none" />
      </TouchableOpacity>
      <TouchableOpacity>
        <Heart size={24} color="white" fill="none" />
      </TouchableOpacity>
    </View>
  );
}
