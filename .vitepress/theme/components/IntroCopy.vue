<template>
	<main>
		<h1>hello...</h1>
		<p class="lede">I'm Amir R Muntasser and I'm a <b>web developer</b>, <b>wizard</b>, <b>sneaker enthusiast</b> and current <b>Director of Web Development</b> at <b>Granicus Destinations</b>.</p>
		<p>Who would have thought that a young, boy from the Southwest would one day grow up to be a winner of one the coveted <a href="https://bsky.app/profile/arkmuntasser.com/post/3lbd3hxods226" target="_blank">Vuenicorns</a> from the very first <b>VueConf Toronto</b> by building a <a href="https://codepen.io/arkmuntasser/pen/QJvPeB">clone of Simon</a>? No one, because that would have been absolutely wild for anyone to concieve and yet here we are and that's what happened.</p>
		<p>I don't code as much as I used to, but I think about it a lot…</p>
	</main>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');

@keyframes rainbow-cycle {
	0% { background-position: 0% center; }
	100% { background-position: 200% center; }
}

main h1 {
	display: inline-block;
	font-family: 'Dancing Script', cursive;
	font-size: 3.5rem;
	background: linear-gradient(to right, #61BB46, #FDB827, #F5821F, #E03A3E, #963D97, #009DDC, #61BB46);
	background-size: 200%;
	background-clip: text;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	color: transparent;
	animation: rainbow-cycle 4s linear infinite;
}

main p {
	font-size: 1.2rem;
	line-height: 1.7;
	margin-block: 1.25rem;
}

main p.lede {
	font-size: 1.5rem;
	font-style: italic;
	line-height: 1.5;
}
</style>
