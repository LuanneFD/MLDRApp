import { CategoryDTO } from "./CategoryDTO";
import { UserDTO } from "./UserDTO";

export type RecipeDTO = {
    id: string;
    name: string;
    description: string;
    time: string;
    servings: string;
    privacy: boolean;
    level: string;
    cover_image: string;
    howto: string;
    ingredients: string;
    category: CategoryDTO;
    video_link:string;
    user: UserDTO;
}