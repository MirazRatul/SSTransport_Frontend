import { sharedPadding } from "./SharedPadding";
import { AppColors } from "../styles/colors";
import { Scale as s, vs } from "react-native-size-matters";

export const container = {
  flex: 1,
  paddingHorizontal: sharedPadding,
  paddingTop: vs(10),
  backgroundColor: AppColors.primaryColor,
};
