export default {
  buildOptions: {
	site: "https://rawcomposition.com",
    sitemap: true,
  },
  devOptions: {
  	hostname: "localhost",
    	port: 3000,
  },
  renderers: ["@astrojs/renderer-preact"],
};
