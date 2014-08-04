
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




# Front-End Best Practices

This setup is based on the very best practices from around the web. 
When writing good front end code you should strive to decouple the CSS, HTML and JS. 
Nothing should be dependent on each other and everything should be modularized. 
When we build new sections to the site, we try to build them from our existing 
modules and __ONLY__ if it's not posible to build it from them, we resort to add additional CSS and Classes.

More CSS and more Classes = More code to maintain = Potentially more bugs

## CSS & HTML
CSS Classes should be based on the BEM syntax and follow an OOCSS approach. 
If you haven't heard about those terms before I recommend reading the following article 
by Philip Walton: http://philipwalton.com/articles/css-architecture/

It goes into depth about what good CSS architecture is and how to use the BEM syntax. 
Klean have written a short introduction in Danish as well (http://www.klean.dk/weblog/systematisk-css-med-bem)

__Additional best practices:__
- Never use ID's for styling. They are more specific than Classes and you will potentional end in CSS specification hell.
- Strive to only have one level of selecters. __NEVER__ do something like `.foo .bar > .qaz a.li {}`. It's too specific and it's not possible to reuse such a selector anywhere else.
- margin-top and padding-top should never be used. By only spacing from the bottom, we eliminate a potential spacing conflict.


## JS
Never attach JavaScript to CSS classes. These are for presentational uses __ONLY__.
If you need to add JS functionality you add a specific class for it and prepend it with js-. E.g. `js-toggle-foo`. By doing that, it's reusable and people inspecting the code can see where there's JS functionality attached.


# Asset / Resource structure
All the assets that relate to this project is placed inside the asset folder and is structured the following way:

```
+--- assets       
  \--- fonts      # Fonts and Icon fonts
  \--- images     # Images
  \--- scripts    # Custom javascript files
  \--- styles     # Sass files
```

External JS files are handled by Gulp and Bower. See `gulpfile.js` for how gulp include e.g. modernizr and respondjs from Bower components.


### Sass structure:
The Sass is structured in the following way:

```
+--- styles       
  \--- utilities    # Vendor files like normalize.css and external fonts
  \--- base         # Base styling and vars, like colors, typography etc.
  \--- modules      # Modules. e.g. buttons, tables, lists other elements used.
  \--+ _shame.scss  # Quick fixes only - read description in file.
  \--+ main.scss    # Main Sass file. This is only for importing all the partial files.
```
- __Utilities__ folder is for vendor files and other external files. These should not be edited.
- __Base__ is for all the variable files and base styling. Like body / html class. Color variables. Typography settings, misc. variables etc. If new colors or variables are added, they should be added here or be based on existing ones so we have a central location for changes.
- __Modules__ is for all the various elements on the page. Even the footer and the header is a module but they are mostly comprised of various other modules.


# For new developers
It's important that you have read and familiarized yourself with the principles and conventions described above.


## Adding new templates/modules:
When adding new modules to the project, it's important to see if it's possible to build these with some of the existing elements.
If that's not an option, then see if it's possible to normalize some of the design so that elements can be reused. 
E.g. we shouldn't add a new class or module specific CSS just because a certain design have `padding-bottom: 19px` while everything
else have `padding-bottom: 22px`. Aesthetically, it might look slightly better, 
but for the general user and the business it won't have any impact and it only adds additional CSS to maintain. 

It's important to question the design if it will result in unmaintainable or messy code.
As a developer, it's your responsibility to write code that's maintainable and readable.

__Remember__: _"More CSS = More code to maintain = Potentially more bugs."_

When adding new templates to the CMS, don't add a CSS page specifically for that.
It might seem useful at first to have a specific styling just for the new `products-gallery-foo-template.html` page. 
The problem is that the CSS specific to that page can't be reused anywhere and it can potentially spin out of control.

Instead, you the existing modules and build the template with those.
If some particular styling is missing, consider adding a new module, or a modification to an existing module.


## Variables

To leverage the full potential of a CSS preprocessor, it's important to use variables. 

All of our variables related to this project is saved inside the `styles/base` folder.

`_typography.scss` contains everything related to font sizes, font families etc. 

The most important variable is probably the `$spacing` variable which is defined in the `_settings.scss` file. 
The value of this variable is based on the base line height, which in most cases
is around 22px.

We use this variable for all margin/padding or otherwise positional related values.
This means we have a central place where we can change the general spacing between
elements and since it's based on the line-height of the base font size,
it gives us a great base value for positioning items that follow the general size and feel of the design.

It also prevents us from using "magic numbers".
This is something that occurs when we stard using very specific pixel units in our CSS.
E.g. `margin: 2px 3px 11px 9px`. As a developer looking at that line,
we know that these units area very tightly coupled to that exact location where that 
element is placed which in turn means it's not reusable since that line only works for in this particular situation.
There can be times where it's nesessary, but as a general rule: Don't use pixels that specific. Use the $spacing variabel or `em`/`%`


# Styleguide
The styleguide is based on [Knyle Style Sheets](https://github.com/hughsk/kss-node)
and is a living documentation compiled from comments in the Sass. 
Read more be following the link before or see some of the examples in the Sass.


-------------


### Todo
- ~~Add KSS Styleguide~~ ✓
- ~~Add Normalize to css~~ ✓
- ~~Add boilerplate Sass setup~~ ✓
- ~~Add grid system~~ ✓
- ~~Update layout.jade with more bestpractices from HTML5 Boilerplate~~ ✓
