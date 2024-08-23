<script lang="ts">
	// Add any necessary imports here
  </script>
  
  <div class="container">
	<h1 class="title">
	  <span class="active">Login</span> /
	  <a href="/register" class="inactive">Register</a>
	</h1>
	<form action="?/login" method="POST" class="auth-form">
	  <div class="form-group">
		<label for="email">Email</label>
		<input type="email" id="email" name="email" required />
	  </div>
	  <div class="form-group">
		<label for="password">Password</label>
		<input type="password" id="password" name="password" required />
	  </div>
	  <button type="submit" class="btn btn-primary">Login</button>
	</form>
	<div class="forgot-password">
	  <a href="/forgotPassword">Forgot Password?</a>
	</div>
  </div>
  
  <style lang="scss">
	.container {
	  max-width: 400px;
	  margin: 2rem auto;
	  padding: 1rem;
	}
  
	.title {
	  text-align: center;
	  margin-bottom: 2rem;
	  font-size: 1.5rem;
  
	  .active {
		text-decoration: underline;
		color: var(--primary);
	  }
  
	  .inactive {
		color: var(--color-paladin-3);
		text-decoration: none;
	  }
	}
  
	.auth-form {
	  display: flex;
	  flex-direction: column;
	  gap: 1rem;
	}
  
	.form-group {
	  display: flex;
	  flex-direction: column;
	  gap: 0.5rem;
	}
  
	label {
	  font-weight: bold;
	}
  
	input {
	  padding: 0.5rem;
	  border: 1px solid var(--accent);
	  border-radius: 4px;
	}
  
	.btn {
	  padding: 0.5rem 1rem;
	  border: none;
	  border-radius: 4px;
	  cursor: pointer;
	  font-size: 1rem;
	  transition: background-color 0.2s;
  
	  &.btn-primary {
		background-color: var(--primary);
		color: white;
  
		&:hover {
		  background-color: darken(#000000, 10%);
		}
	  }
	}
  
	.forgot-password {
	  text-align: center;
	  margin-top: 1rem;
  
	  a {
		color: var(--primary);
		text-decoration: none;
  
		&:hover {
		  text-decoration: underline;
		}
	  }
	}
  
	@media (max-width: 480px) {
	  .container {
		padding: 1rem 0.5rem;
	  }
  
	  .title {
		font-size: 1.2rem;
	  }
  
	  .btn {
		width: 100%;
	  }
	}
  </style>