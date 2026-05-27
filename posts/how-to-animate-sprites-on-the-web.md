---
title: Animating Sprites on the Web
date: "2021-05-01"
excerpt: You like sprites? I like sprites. So I wanted to make see how easy it would be to make an animation from a sprite sheet. Turns out it's super easy, barely an iconvenience.
author:
  - amir
category:
  - javascript
  - animation
featured: false
weeknotes: false
updated: "2026-05-27"
changelog:
  - Updated preview to use Codepen instead of Glitch.
  - Text updates for clarity and accuracy.
  - Added headings.
---

The other day I was thinking back on the my early days building small games with [RPG Maker](https://www.rpgmakerweb.com) and I was thinking about all the cool sprite sheets I would download and make. I wasso fascinated by sprite sheets and how you could get such complex animations with relatively little. Of course, now that I'm grown up and understand quite a bit more about animation and film in general I know that those sprite animations weren't all that technically advanced. But that doesn't mean I'm any less enamored with them.

I was curious how easy it would be to load a sprite sheet an animate on the web. Turns out it's super easy, barely an inconvenience. Check out my sweet animation:

<figure>
	<iframe height="300" style="width: 100%;" scrolling="no" title="Sprite Animation Web Animations API" src="https://codepen.io/editor/arkmuntasser/embed/019e6a95-d656-7b4b-8644-1a4d37185a64?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true"></iframe>
	<figcaption class="sr-only">
	See the Pen <a href="https://codepen.io/editor/arkmuntasser/pen/019e6a95-d656-7b4b-8644-1a4d37185a64">
		Sprite Animation Web Animations API</a> by Amir R Muntasser (<a href="https://codepen.io/arkmuntasser">@arkmuntasser</a>)
		on <a href="https://codepen.io">CodePen</a>.
	</figcaption>
</figure>

## Setting up the HTML
To create the animation I need to know 2 things: how many individual spites make up the animation (or frames in the animation) and the dimensions of each sprite.

First, I'm going to create a box that is the dimensions of a single sprite and set it's `background-image` to out sprite sheet.

```html
<style>
	#sprite {
		display: block;
		width: 77px;
		height: 80px;
		background-color: #333;
		background-image: url('/images/your-sprite-sheet.jpg');
		background-position: 0 0;
		background-size: auto 100%;
	}
</style>
<div id="sprite"></div>
```

## Enter the Web Animations API
Next we're going to animate this using the [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API). Why use the Web Animations API here instead of just writing the animation in CSS using `@keyframes`? Well, I've never used the Web Animations API and wanted a chance to play with it a bit. This could totally be done with just CSS as we'll discuss further down.

Here's what that code looks like:

```javascript
const numFrames = 6;
const frameWidth = 77;

const keyframes = new Array(numFrames)
  .fill(0)
  .map((x, i) => ({ backgroundPosition: (i * -1 * frameWidth) + 'px 0' }));

sprite.animate(keyframes, {
  easing: 'steps(' + numFrames + ', jump-none)',
  duration: 400,
  iterations: Infinity
});
```

And boom, you're done! Behold as your sprite comes to life; you might need to adjust the easing and duration until it looks right. And with little tweaking, this can work for any sprite of any size and any animation of an complexity as complexity is merely the number of frames.

## Conclusion
But how practical is something like this? Well, a gif or and SVG can actually end up being very expensive especially if your animation is small in size and contains a lot of moving parts. Making a sprite sheet can actually be more performant than other methods.

In fact, Twitter uses this exact style of animation for their like buttons! [Check out this great article detailing that animation](https://medium.com/@chrismabry/how-did-they-do-that-the-twitter-like-animation-2a473b658e43). You'll notice they do it using CSS.

If I were implementing this for an actual project, I would go the CSS route because there are performance concerns with using JS for animation. In a lab setting, the CSS implementation and JS implementation are essentially equal it terms of performance, but in a real world setting JS has a lot of competition on the main thread that could cause it to perform poorly. CSS has no such conflicts.

With this technique, there a whole new world of animation possibilities that opens up on the web. I look forward for a chance to actually use this on a real project at some point.
