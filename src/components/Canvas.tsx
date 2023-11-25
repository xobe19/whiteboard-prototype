import useWindowSize from "../hooks/useWindowSize";

function Canvas() {
  const [height, width] = useWindowSize();
return <canvas width={width} height={height} className="overflow-hidden bg-white">

</canvas>
}

export default Canvas;