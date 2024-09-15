<script>
    import { page } from '$app/stores';
    export let newToEnneagramUrl = "/enneagram-corner/beginners-guide-to-determining-your-enneagram-type";
    export let joinCommunityUrl = "/register";
    $: slug = $page.params.slug;

    
  </script>
  
  <div class="blog-callout">
    <h3 style="margin: .5rem 0; padding: .7rem 0; margin-top: 0; padding-top: 0;">This blog is written for 
        <span style="color: var(--accent-dark)">you</span> to learn about yourself, not just about <span style="color: var(--accent-dark)">{slug.split('-').join(' ')}</span></h3>     
    

        <!-- <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="width: 1rem;display: inline;">
            <path d="M48.5 224L40 224c-13.3 0-24-10.7-24-24L16 72c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2L98.6 96.6c87.6-86.5 228.7-86.2 315.8 1c87.5 87.5 87.5 229.3 0 316.8s-229.3 87.5-316.8 0c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0c62.5 62.5 163.8 62.5 226.3 0s62.5-163.8 0-226.3c-62.2-62.2-162.7-62.5-225.3-1L185 183c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8L48.5 224z"/></svg> -->
    

    <div class="text-sections">
      <div class="enneagram-familiar">
        <h4 style="margin: 0; padding: .5rem 0;">If you are already deep into the Enneagram</h4>
        <p style="margin-top: .5rem;">
          Join our growing community of individuals
          who are exploring their inner worlds and learning from each other.
          Share your insights and discover new perspectives here on 9takes.
        </p>
      </div>
      <div class="enneagram-new">
        <h4 style="margin: 0px; padding: .5rem 0;">Hearing about the Enneagram for the first time?</h4>
        <p style="margin-top: .5rem;">
          Learn more. The Enneagram is a powerful tool for self-discovery and understanding others.
          It offers unique insights into your personality and gets at your core fears and motivations.
          With it you can better understand yourself and those around you.
        </p>
      </div>
    </div>
    
    <div class="button-container">
      <a href={newToEnneagramUrl} class="button explore">
        &#8592; Learn More About the Enneagram
      </a>
      <a href={joinCommunityUrl} class="button join">
                I'm Ready to Join the Community &#8594;
      </a>
    </div>
  </div>
  
  <style lang="scss">
    .blog-callout {
      background-color: #f8f8f8;
      border: 1px solid var(--accent-darker);
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
  
    .text-sections {
      margin-bottom: 20px;
    }
  
    h2 {
      font-size: 1.2em;
      margin-bottom: 10px;
    }
  
    p {
      margin-bottom: 15px;
    }
  
    .button-container {
      display: flex;
      justify-content: space-between;
      gap: 10px;

      a::after {
        content: none
      }
    }
  
    .button {
      display: inline-block;
      padding: 10px 15px;
      border-radius: 5px;
      text-decoration: none;
      font-weight: bold;
      text-align: center;
      flex: 1;
    }
  
    .explore {
      border: 1px solid var(--accent-dark);
      color: white;
    }
  
    .join {
      background-color: var(--accent-dark);
      color: white !important;
    }
  
    @media (max-width: 600px) {
      .button-container {
        flex-direction: column;
      }
    }
  </style>