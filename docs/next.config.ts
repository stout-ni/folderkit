import nextra from 'nextra';

const withNextra = nextra({
  defaultShowCopyCode: true,
});

export default withNextra({
  redirects: async () => [
    {
      source: '/',
      destination: '/docs',
      permanent: true,
    },
  ],
});
