# Welcome!

This repository houses the [Astro](https://astro.build) project that powers my personal website: [RawComposition.com](https://rawcomposition.com).

The [Home page](https://rawcomposition.com) pulls images from my [Flickr photostream](https://www.flickr.com/photos/rawcomposition/) through their API. The [Life List page](https://rawcomposition.com/lifelist/) pulls images from [eBird](https://ebird.org/media/catalog?sort=upload_date_desc&regionCode=&userId=USER730325) where I upload all my bird pictures. I then group the images by species and sort them by eBird's star rating and choose the top 3.

The site is hosted on [Netlify](https://www.netlify.com/) which builds the project into static pages for really fast load times. I don't have to wait for the Flickr and eBird APIs to return their results, since it's already done at build time. Whenever I update my Flickr photostream or add new species on eBird, I just go into my Netlify dashboard and rebuild.

**[Go to RawComposition.com](https://rawcomposition.com)**

## Commands

| Command         | Action                                              |
|:----------------|:----------------------------------------------------|
| `yarn install`  | Installs dependencies                               |
| `yarn dev`      | Starts local dev server at `localhost:3000`         |
| `yarn ebird`    | Pull photos from eBird and store in `public/*.json` |
| `yarn build`    | Build production site to `./dist/`                  |