import NeonBuilderContext from "../../context/NeonBuilderContext";
import Controls from "./Controls/Controls";
import Visuals from "./Controls/visuals/Visuals";
import { useEffect } from "react";
import { useGlobalContext } from "../../context/GlobalContext";
import Nav from "../nav/Nav";

const CustomNeonBuilder = () => {
  const [globalState, setGlobalState] = useGlobalContext();
  useEffect(() => {
    if (!globalState.showBanner) return; 
    setGlobalState(state => ({...state, showBanner: false}))
  }, [])
  return (
    <NeonBuilderContext>
      <div className="flex flex-col h-screen overflow-hidden">
        <Nav className=" absolute top-0  inset-x-0 z-10" />
        <div className="absolute inset-x-0 top-[58px] h-[calc(100%-58px)] md:top-[62px] md:h-[calc(100%-62px)] bg-black flex flex-col lg:flex-row w-full">
          <Visuals />
          <Controls />
        </div>
      </div>
    </NeonBuilderContext>
  );
};

export default CustomNeonBuilder;
