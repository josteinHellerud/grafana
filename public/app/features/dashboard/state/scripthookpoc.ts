import { TextBoxVariableModel, VariableHide } from 'app/features/variables/types';
import { NEW_VARIABLE_ID } from 'app/features/variables/state/types';
import { VariableType } from '@grafana/data';

export default async function scriptHookPoc(add: any, state: any) {
  const userinput = state.userinput.current.value;

  const { result } = await fetch(`https://api.chucknorris.io/jokes/search?query=${userinput}`).then(result =>
    result.json()
  );

  const value = result[Math.floor(Math.random() * result.length)].value;

  const type: VariableType = 'textbox';
  const id = NEW_VARIABLE_ID;

  const identifier = { type, id };

  const model: TextBoxVariableModel = {
    ...identifier,
    name: 'fromScriptHook',
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
  return add(model);
}
