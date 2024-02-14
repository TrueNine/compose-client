import type { CustomRollupConfig } from "@/CustomRollupConfig";

export function umdGlobalDtsTemplateFill(config: CustomRollupConfig) {
    const lvName = `_${config.umd?.globalVarName}`;
    const vName = `${config.umd?.globalVarName}`;
    const fName = `${config.umd?.fileName}`;
    return `
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./${fName}.d.ts" />
import * as ${lvName} from './${fName}'

declare global {
  // eslint-disable-next-line no-var
  var ${vName}: typeof ${lvName} = ${lvName}
}


// eslint-disable-next-line no-var
declare var ${vName} = ${lvName}
export * from './${fName}'

// eslint-disable-next-line
// ts-ignore
export = ${vName}
`
        .trim()
        .trimStart()
        .trimEnd();
}
