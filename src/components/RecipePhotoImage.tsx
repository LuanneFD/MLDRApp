import { api } from "@services/api";
import { Image, Skeleton, VStack, Text, Center } from "native-base";
import noImage from "@utils/noImage.png";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

type Props = TouchableOpacityProps & {
  widthSize: "full" | number;
  sourceImage: string;
  isLoading: boolean;
  descriptionButton: string;
};

export function RecipePhotoImage({
  widthSize,
  sourceImage,
  isLoading,
  descriptionButton,
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
        <Text
          color="green.500"
          fontWeight={"bold"}
          fontSize={"md"}
          marginBottom={8}
        >
          {descriptionButton}
        </Text>
      </TouchableOpacity>
    </VStack>
  );
}
