<script lang="ts">
</script>

<div>
	<h1 style="text-align: center; margin: 1rem;">
		<a href="/login">Login</a> /
		<span style="text-decoration: underline; color: #5407d9;">Register</span>
	</h1>
	<form action="?/register" method="POST" class="auth-form">
		<label for=""> Email </label>
		<input type="text" name="email" />
		<label for=""> Password </label>
		<input type="password" name="password" />
		<button class="btn btn-primary">Register</button>
	</form>
	<br />
	<div style="text-align: center; margin: 1rem;">
		<a href="/forgotPassword">Forgot Password</a>
	</div>
</div>

<style lang="scss">
</style>
