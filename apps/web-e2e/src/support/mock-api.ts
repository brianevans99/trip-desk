import type { Page } from '@playwright/test';

const photo = (n: number) => ({
  __typename: 'Photo',
  url: `/e2e-photo-${n}.jpg`,
  alt: `Sample photo ${n}`,
  attribution: { __typename: 'PhotoAttribution', author: 'Test Author', url: 'https://unsplash.com' },
});

const lisbon = {
  __typename: 'Destination',
  id: 'lisbon',
  name: 'Lisbon',
  country: 'Portugal',
  airportCode: 'LIS',
  summary: 'Hilly coastal capital known for trams, tiles and custard tarts.',
  summaryAttribution: { __typename: 'Attribution', source: 'Wikivoyage', url: 'https://en.wikivoyage.org', license: 'CC BY-SA' },
  photos: [photo(1), photo(2), photo(3)],
  places: [
    { __typename: 'Place', id: 'p1', name: 'Belém Tower', category: 'sight', address: 'Av. Brasília, Lisbon' },
  ],
};

const unauthenticated = {
  data: null,
  errors: [{ message: 'Not signed in', extensions: { code: 'UNAUTHENTICATED' } }],
};

export async function mockApi(page: Page) {
  await page.route('**/graphql', async (route) => {
    const { operationName } = route.request().postDataJSON() ?? {};
    switch (operationName) {
      case 'Destinations':
        return route.fulfill({ json: { data: { destinations: [lisbon] } } });
      case 'Destination':
        return route.fulfill({ json: { data: { destination: lisbon } } });
      default:
        // Signed-out by default: Itineraries, the user menu, and anything else
        return route.fulfill({ json: unauthenticated });
    }
  });
}
