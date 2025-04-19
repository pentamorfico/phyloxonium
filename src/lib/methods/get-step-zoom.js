import defaults from "../defaults";

export default function getStepZoom() {
  // Always return the stepZoom prop rather than reading from deck.viewState
  return this.props.stepZoom ?? defaults.stepZoom;
}
