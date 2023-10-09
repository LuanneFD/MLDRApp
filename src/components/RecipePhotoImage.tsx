import { api } from "@services/api";
import { Image, Skeleton, VStack, Text, Center, Icon } from "native-base";
import noImage from "@utils/noImage.png";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { AntDesign } from '@expo/vector-icons'; 

type Props = TouchableOpacityProps & {
  widthSize: "full" | number;
  sourceImage: string;
  isLoading: boolean;
};

export function RecipePhotoImage({
  widthSize,
  sourceImage,
  isLoading,
  ...rest
}: Props) {

  return (
    <VStack>
      {isLoading ? (
        <Skeleton
          height={40}
          width={widthSize}
          rounded={"lg"}
          startColor="gray.500"
          endColor="gray.400"
        />
      ) : (
        <>
          {sourceImage ? (
            <Image
              width={widthSize}
              height={40}
              alt="Imagem da receita"
              resizeMode="cover"
              rounded={"lg"}
              source={{
                uri: `${api.defaults.baseURL}/imagens/${sourceImage}`,
              }}
            />
          ) : (
            <Center borderColor={"gray.600"} borderWidth={"2"}>
              <Image
                width={widthSize}
                height={40}
                alt="Imagem da receita"
                resizeMode="cover"
                rounded={"lg"}
                source={noImage}
              />
            </Center>
          )}
        </>
      )}
      <TouchableOpacity {...rest}>
      <Icon as={AntDesign} name="pluscircle" color={"red.500"} size={8} marginTop={2}/>
      </TouchableOpacity>
    </VStack>
  );
}
