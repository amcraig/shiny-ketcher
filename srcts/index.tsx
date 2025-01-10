import { StandaloneStructServiceProvider } from "ketcher-standalone";
import { Ketcher } from "ketcher-core";
import { Editor } from "ketcher-react";
import "ketcher-react/dist/index.css";
import React from "react";

import {
  makeReactOutput,
} from "@posit-dev/shiny-bindings-react";

const structServiceProvider = new StandaloneStructServiceProvider()

// KetcherReact component
function KetcherReact({
  struct
}: {
  struct: string
}) {
  const [ketcherInstance, setKetcherInstance] = React.useState<Ketcher|undefined>(undefined)

  React.useEffect(() => {
    if (ketcherInstance) {
      try {
        ketcherInstance.setMolecule(struct);
      } catch (error) {
        console.error("Failed to set SMILES:", error);
      }
    }
  }, [ketcherInstance, struct]);

  return (
    <div style={{
      width: "800px",
      height: "700px",
      minWidth: "500px",
      minHeight: "500px",
      resize: "both",
      overflow: "auto"
    }}>
      <Editor
        staticResourcesUrl=""
        structServiceProvider={structServiceProvider}
        onInit={(ketcher) => {
          // Assign Ketcher instance to window for KetcherLogger to use
          /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
          // @ts-ignore
          window.ketcher = ketcher;
          setKetcherInstance(ketcher);
        }}
        errorHandler={(message: string) => {
          console.log("From Ketcher:: ", message.toString());
        }}
      />
    </div>
  );
}

makeReactOutput<{ value: string }>({
  name: "shiny-ketcher-output",
  selector: "shiny-ketcher-output",
  renderComp: ({ value }) => (
    <KetcherReact struct={value} />
  ),
});

// makeReactOutput NEEDS to have the stringified input called "value",
// afterwards you can deserialize it if need be
// makeReactOutput<{ value: string }>({
//   name: "shiny-ketcher-output",
//   selector: "shiny-ketcher-output",
//   renderComp: ({ value }) => {
//     const obj = JSON.parse(value);
//     console.log("obj", obj);
//     return (
//       <KetcherReact struct={obj["struct"]} />
//     );
//   }
// });
