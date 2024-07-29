import { Tooltip } from 'react-tailwind-tooltip';

function App() {
  return (
    <div className="flex flex-row items-center p-10 h-[300px]">
      <div className="grid content-between h-full">
        <Tooltip
          title="The tooltip does not fit on top so it is shown at another side"
          placement="top"
          arrow
        >
          <button className="p-2 bg-green-500 text-white rounded ">Tooltip on top</button>
        </Tooltip>

        <Tooltip title="Tooltip on top" placement="top" arrow>
          <button className="p-2 bg-green-500 text-white rounded ">Tooltip on top</button>
        </Tooltip>
      </div>
      <div className="flex flex-col justify-between items-center h-full ml-10">
        <Tooltip title="Tooltip on bottom" placement="bottom" arrow>
          <button className="p-2 bg-blue-500 text-white rounded">Tooltip on bottom</button>
        </Tooltip>

        <Tooltip title="Tooltip on left" placement="left" arrow>
          <button className="p-2 bg-red-500 text-white rounded">Tooltip on left</button>
        </Tooltip>
        <Tooltip title="Tooltip on right" placement="right" arrow>
          <button className="p-2 bg-yellow-500 text-white rounded">Tooltip on right</button>
        </Tooltip>
        <Tooltip
          title="Styled tooltip"
          arrow
          tooltipStyle={'bg-green-700/95 text-white'}
          arrowStyle={'to-green-700/95'}
        >
          <button className="p-2 bg-blue-500 text-white rounded">Styled tooltip</button>
        </Tooltip>
      </div>
    </div>
  );
}

export default App;
