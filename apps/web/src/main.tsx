import { ApolloProvider  } from '@apollo/client/react';
import { client } from './apollo';
import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <ApolloProvider client={client}>
    <StrictMode>
      <BrowserRouter>
         <App />
      </BrowserRouter>
    </StrictMode>
  </ApolloProvider>
);
