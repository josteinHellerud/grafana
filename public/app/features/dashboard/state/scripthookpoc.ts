import { TextBoxVariableModel, VariableHide } from 'app/features/variables/types';
import { NEW_VARIABLE_ID } from 'app/features/variables/state/types';
import { VariableType } from '@grafana/data';

export default async function scriptHookPoc(add: any, state: any) {
  const userinput = state.userinput.current.value;
  let hookArray = [];

  const type: VariableType = 'textbox';
  const id = NEW_VARIABLE_ID;
  const identifier = { type, id };

  try {
    const { results } = await fetch(
      `http://localhost:8086/query?pretty=true&db=NOAA_water_database&q=SHOW MEASUREMENTS`
    ).then(result => result.json());
    const measurements = results[0].series[0].values;
    const value = measurements[Math.floor(Math.random() * measurements.length)][0];
    hookArray.push(variableModel('measurementfromScriptHook', identifier, value));
  } catch (err) {
    console.log('fething measurements failed');
    console.log(err);
  }

  try {
    if (userinput) {
      console.log(userinput);
    }
    const { results } = await fetch(
      `http://localhost:8086/query?pretty=true&db=NOAA_water_database&q=SELECT pair_name FROM "routing"."autogen"."routing_pairs" where "host_name" =~ /${userinput}/`
    ).then(result => result.json());
    const measurements = results[0].series[0].values;
    const value = measurements[0][1];
    hookArray.push(variableModel('routingPairScriptHook', identifier, value));
  } catch (err) {
    console.log('fething pair_name failed');
    console.log(err);
  }

  return add(hookArray);
}

interface Identifier {
  type: VariableType;
  id: string;
}

const variableModel = (name: string, identifier: Identifier, value: string) => {
  const model: TextBoxVariableModel = {
    ...identifier,
    name: name,
    label: null,
    index: 10,
    skipUrlSync: true,
    hide: VariableHide.dontHide,
    global: false,
    current: {
      selected: false,
      value: value,
      text: value,
    },
    query: value,
    options: [],
  };
  return model;
};
