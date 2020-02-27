export const getPropInSafe = <SourceObject extends Object, Result>(
  object: SourceObject,
  resultReader: (x: SourceObject) => Result,
  replacer: any = undefined
): Result => {
  try {
    return resultReader(object);
  } catch (_) {
    return replacer;
  };
};
