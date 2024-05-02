<script lang="ts">
</script>

<div>
	<h1 style="text-align: center; margin: 1rem;">
		<span style="text-decoration: underline; color: #5407d9;">Login</span> /
		<a href="/register" class="unselected">Register</a>
	</h1>
	<form action="?/login" method="POST" class="auth-form">
		<label for=""> Email </label>
		<input type="text" name="email" />
		<label for=""> Password </label>
		<input type="password" name="password" />
		<button class="btn btn-primary">Login</button>
	</form>
	<br />
	<div style="text-align: center; margin: 1rem;">
		<a href="/forgotPassword">Forgot Password</a>
	</div>
</div>

<style lang="scss">
	.unselected {
		color: var(--color-paladin-3) !important;
	}
</style>
