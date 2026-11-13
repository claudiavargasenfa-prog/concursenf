import { getLearningCatalog } from "./catalog.service";
import { getMyLearningProgress } from "./progress.service";
import { getMyDueReviews } from "./review.service";

export async function getMyLearningWorkspace(examSlug = "ebserh-hubrasil") {
  const [catalog, progress, dueReviews] = await Promise.all([
    getLearningCatalog(examSlug),
    getMyLearningProgress(),
    getMyDueReviews(),
  ]);
  return { catalog, progress, dueReviews };
}
