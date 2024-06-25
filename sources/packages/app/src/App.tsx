import React, { Suspense } from 'react';
import { ExperienceBuilder, RenderField, useGuestContext, RenderRepeat, RenderComponents } from '@craftercms/experience-builder/react';
import { ContentInstance } from '@craftercms/models';
import { getModel } from './lib/api';
import { BASE_URL } from './constants';
import { isAuthoring } from './utils';
import './App.css';

interface ContentProps {
  model: ContentInstance;
}

function Header(props: ContentProps) {
  const { model } = props;
  const guestContext = useGuestContext();
  const editMode = guestContext?.editMode;

  return (
    <header className="App-header">
      <h4>Nested repeating groups</h4>
      <RenderRepeat
        model={model}
        fieldId="repGroup1_o"
        component={"ul"}
        renderItem={(item: ContentInstance, index: number) => (
          <li>
            <RenderField
              model={model}
              fieldId="repGroup1_o.text_t" // That way the component knows that the field we are rendering is 'text_t' from 'bullets_o'
              index={index} // We also need to let the component know the index of the field inside the rep group being rendered
              render={() => {
                return <>
                  <div>{item.text_t} - {index}</div>
                  <RenderRepeat
                    model={model}
                    fieldId="repGroup1_o.subRepGroup1_o"
                    index={index}
                    component={"ul"}
                    renderItem={(item: ContentInstance, index: number) => (
                      <div>{item.text_t} - {index}</div>
                    )}
                  />
                </>;
              }}
            />
          </li>
        )}
      />
    </header>
  );
}

function App() {
  const [model, setModel] = React.useState<ContentInstance>();

  React.useEffect(() => {
    getModel().subscribe((model) => {
      setModel(model instanceof Array ? model[0] : model);
    });
  }, []);

  return (
    <Suspense fallback={<div />}>
      <div className="App" role="main">
        {model && (
          // @ts-ignore
          <ExperienceBuilder isAuthoring={isAuthoring()} path={model.craftercms?.path}>
            <Header model={model} />
          </ExperienceBuilder>
        )}
      </div>
    </Suspense>
  );
}

export default App;
