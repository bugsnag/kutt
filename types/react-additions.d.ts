import "react";

declare module "react" {
  export type ActionDispatch<T = any> = (action: T) => void;
}
