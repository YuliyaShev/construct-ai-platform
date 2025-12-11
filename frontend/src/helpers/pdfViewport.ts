export type PageMetrics = {
  width: number;
  height: number;
};

export type ViewState = {
  scale: number;
  translateX: number;
  translateY: number;
};

export type ContainerSize = {
  width: number;
  height: number;
};

export type NormalizedRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function clampScale(scale: number, min = 0.35, max = 4) {
  return clamp(scale, min, max);
}

export function getDevicePixelRatioSafe() {
  if (typeof window === "undefined") return 1;
  return clamp(window.devicePixelRatio || 1, 1, 3);
}

export function getScaledPageSize(page: PageMetrics, scale: number) {
  return {
    width: page.width * scale,
    height: page.height * scale
  };
}

export function fitWidthScale(containerWidth: number, pageWidth: number, gutter = 32) {
  if (!containerWidth || !pageWidth) return 1;
  return clampScale((containerWidth - gutter) / pageWidth);
}

export function centerWithinContainer(container: ContainerSize, page: PageMetrics, scale: number) {
  const scaled = getScaledPageSize(page, scale);
  const translateX = (container.width - scaled.width) / 2;
  const translateY = (container.height - scaled.height) / 2;
  return { translateX, translateY };
}

export function constrainTranslation(
  view: ViewState,
  container: ContainerSize,
  page: PageMetrics,
  overscrollPadding = 120
) {
  const scaled = getScaledPageSize(page, view.scale);

  const translateX =
    scaled.width < container.width
      ? (container.width - scaled.width) / 2
      : clamp(view.translateX, container.width - scaled.width - overscrollPadding, overscrollPadding);

  const translateY =
    scaled.height < container.height
      ? (container.height - scaled.height) / 2
      : clamp(view.translateY, container.height - scaled.height - overscrollPadding, overscrollPadding);

  return { translateX, translateY, scale: view.scale };
}

export function toTransformCss(view: ViewState) {
  return `translate(${view.translateX}px, ${view.translateY}px) scale(${view.scale})`;
}

export function viewportRect(view: ViewState, container: ContainerSize, page: PageMetrics): NormalizedRect {
  const visibleWidth = container.width / view.scale;
  const visibleHeight = container.height / view.scale;
  const x = clamp(-view.translateX / view.scale, 0, page.width - visibleWidth);
  const y = clamp(-view.translateY / view.scale, 0, page.height - visibleHeight);

  return {
    x: x / page.width,
    y: y / page.height,
    width: clamp(visibleWidth / page.width, 0, 1),
    height: clamp(visibleHeight / page.height, 0, 1)
  };
}
