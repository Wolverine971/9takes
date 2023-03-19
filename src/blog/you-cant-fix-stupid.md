---
title: 'you-cant-fix-stupid'
description: "9takes Enneagram Overview"
author: 'DJ Wayne'
date: '2023-02-10'
published: false
type: ['overview']
blog: true

---
<!-- 
The moment they stopped thinking
https://youtube.com/watch?v=3PfsANvaueQ&si=EnSIkaIECMiOmarE&t=4526

Reminds me of Steven Pinker- rational and irrational

Reminds me of plato to aristotle- plato tripart soul vrs bibart soul -->

<body>
	<header>
		<h1>Responsive Layout Example</h1>
	</header>
	<nav>
		<ul>
			<li><a href="#">Home</a></li>
			<li><a href="#">About</a></li>
			<li><a href="#">Contact</a></li>
		</ul>
	</nav>
	<main>
		<section>
			<h2>Section One</h2>
			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum consequat lorem vel velit blandit, euismod suscipit purus viverra. Suspendisse varius erat eget justo pharetra, a vestibulum est cursus. Donec ut purus rutrum, mattis turpis sit amet, vestibulum quam. </p>
		</section>
		<section>
			<h2>Section Two</h2>
			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum consequat lorem vel velit blandit, euismod suscipit purus viverra. Suspendisse varius erat eget justo pharetra, a vestibulum est cursus. Donec ut purus rutrum, mattis turpis sit amet, vestibulum quam. </p>
		</section>

        <div class="waitlist-section">
  <h2>Join our waitlist!</h2>
  <p>Be the first to know when our product is ready.</p>
  <form class="waitlist-form">
    <label for="email">Enter your email:</label>
    <input type="email" id="email" name="email" placeholder="you@example.com">
    <button type="submit">Join now</button>
  </form>
</div>
	</main>
	<footer>
		<p>&copy; 2023 Responsive Layout Example</p>
	</footer>
</body>

<style>

    /*Basic styles*/
body {
	/*font-family: Arial, sans-serif;*/
	margin: 0;
	padding: 0;
}
h1, h2 {
	margin-top: 0;
}
ul {
	list-style: none;
	margin: 0;
	padding: 0;
}
a {
	color: #333;
	text-decoration: none;
}
/*Header styles*/
header {
	background-color: #333;
    background-image: url('/background.png');
	color: #fff;
	padding: 20px;
}
/*Navigation styles*/
nav {
	background-color: #f2f2f2;
	border-bottom: 1px solid #5407d9;
	padding: 10px;
}
nav ul {
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-wrap: wrap;
}
nav li {
	margin: 10px;
}
/*Main content styles*/
main {
	margin: 20px;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
}
section {
	flex-basis: calc(50% - 20px);
	margin-bottom: 20px;
	padding: 10px;
	background-color: #f2f2f2;
	border: 1px solid #5407d9;
	box-sizing: border-box;
}
/*Footer styles*/
footer {
	background-color: #333;
	color: #fff;
	padding: 20px;
	text-align: center;
}
/*Media queries*/
@media (max-width: 768px) {
	header h1 {
		font-size: 24px;
	}
	nav li {
		margin: 5px;
	}
	main section {
		flex-basis: calc(100% - 20px);
	}
}
@media (max-width: 480px) {
	header h1 {
		font-size: 18px;
	}
	main section {
		flex-basis: 100%;
	}
}

.waitlist-section {
  text-align: center;
}
.waitlist-form {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.waitlist-form label {
  margin-bottom: 10px;
}
.waitlist-form input {
  width: 100%;
  max-width: 300px;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #5407d9;
}
.waitlist-form button {
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}
/*For tablets*/
@media only screen and (min-width: 768px) {
  .waitlist-form {
    max-width: 500px;
  }
  .waitlist-form input {
    max-width: 400px;
  }
}
/*For PCs*/
@media only screen and (min-width: 992px) {
  .waitlist-section {
    display: flex;
    justify-content: center;
  }
  .waitlist-form {
    max-width: 600px;
    flex-direction: row;
    align-items: center;
  }
  .waitlist-form label {
    margin-right: 10px;
    margin-bottom: 0;
  }
  .waitlist-form input {
    margin-right: 10px;
    margin-bottom: 0;
  }
}

    </style>
