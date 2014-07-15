
# [ Prototype Seed ](https://github.com/chriskjaer/prototype-seed)
> Includes [BrowserSync](https://github.com/shakyShane/browser-sync) for fast reloading across devices on code changes. [Jade](http://jade-lang.com) templating, [Sass](http://sass-lang.com/), basic html boilerplate with [Respond.js](https://github.com/scottjehl/Respond)(Media Querry fallback) and [Modernizr](http://modernizr.com/) and a simple grid implementation based on a mix of Semantic.gs and Inuit Grid.

## Installation guide:

__Prerequisites__
[Node](http://nodejs.org) and [Bower](http://bower.io/)

When those are installed, run the following:
```
npm install
npm install gulp -g
```
`npm install` triggers a bower install after all the npm modules have been
installed.

After that, start the project by running the gulp command:
```
gulp
```

Gulp will now start a server and open a window with the website. 

## Notes:

- Search engines have been disabled by default. Change this in robots.txt
- Enable basic HTTP-Auth in the server.js file. This is only enabled when
  serving the site from express. Like when it's hosted on heroku.

# Deploy Prototype to Heroku
Make sure you have the [Heroku Toolbelt](https://toolbelt.heroku.com/)
installed.

First, create your app:

```
  heroku apps:create your-app-name
```
If you need to deploy to a european region, append `--region eu`
When that's done, you can push to heroku afterwards by doing:
```
  git push heroku
```

and it will automaticly deploy the newest code to heroku and build it there.



### Todo
- Add KSS Styleguide
- Add Normalize to css
- Add boilerplate Sass setup
- Add grid system
- Update layout.jade with more bestpractices from HTML5 Boilerplate
