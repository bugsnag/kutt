declare module "react" {
  // augment missing ActionDispatch used by Next devtools
  export type ActionDispatch<T = any> = (action: T) => void;
}
