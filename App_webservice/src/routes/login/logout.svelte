<script context="module">

	export function preload({ params }, { user }) {
        // const { session } = stores();
		if (user) {
            this.fetch('auth/logout', {method: post});
            // $session.token = null;
        }
        this.redirect(302, `/login`);
	}
</script>