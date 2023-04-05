import html2canvas from "html2canvas";

export async function exportComponentAsPNG(
  componentRef: HTMLDivElement
): Promise<string> {
  return html2canvas(componentRef).then((canvas) => canvas.toDataURL());
}
