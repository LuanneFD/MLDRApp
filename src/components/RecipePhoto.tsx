import {Image, IImageProps} from 'native-base';

type Props = IImageProps & {
    size: number;
}

export function RecipePhoto({size, ...rest} : Props) {
    return (
        <Image
        w={size}
        h={size}
        borderWidth={3}
        borderColor="gray.400"
        rounded={'3xl'}
        {...rest}
        />
    );
}