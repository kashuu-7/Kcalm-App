import { Suspense } from "react";
import RecipeHome from "../../components/recipe-player/RecipeHome";

export default function RecipePlayerPage() {
  return (
    <Suspense fallback={null}>
      <RecipeHome />
    </Suspense>
  );
}