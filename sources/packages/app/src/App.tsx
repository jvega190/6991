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
      <h1>Nested repeating groups</h1>
      <RenderRepeat
        model={model}
        fieldId="repGroup1_o"
        component="ul"
        renderItem={(item: ContentInstance, index: number) => (
          <li style={{display: 'block'}}>
            <h2>Repeat group - Item {index}</h2>
            <RenderField model={model} fieldId="repGroup1_o.text_t" index={index}/>
            <RenderRepeat
              model={model}
              index={index}
              fieldId="repGroup1_o.subRepGroup1_o"
              component="ul"
              renderItem={(subitem: ContentInstance, subItemIndex: number) => (
                <li>
                  <h3>Repeat 2 - Item {subItemIndex}</h3>
                  <RenderField
                    model={model}
                    fieldId="repGroup1_o.subRepGroup1_o.text_t"
                    index={subItemIndex}
                  />
                </li>
              )}
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
    <Suspense fallback={<div/>}>
      <div className="App" role="main">
        {model && (
          // @ts-ignore
          <ExperienceBuilder isAuthoring={isAuthoring()} path={model.craftercms?.path}>
            <Header model={model}/>
          </ExperienceBuilder>
        )}
      </div>
    </Suspense>
  );
}

export default App;
