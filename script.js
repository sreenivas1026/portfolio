    // <!-------------------------MENU BAR script-------------------------->
    const toggleButton = document.getElementById('menuToggle');

    const activeMenu = () =>{
    toggleButton.classList.toggle('active');
    }
    toggleButton.addEventListener('click',activeMenu);
    
    
    
    // <!-----------------------Skills Animation---------------------------->
    const skillsContent = document.getElementsByClassName('skillsContent'),
    skillsHeader = document.querySelectorAll('.skillsHeader')
    
    
    function toggleSkills(){
    let itemClass = this.parentNode.className
    
    for(i=0;i<skillsContent.length;i++){
    skillsContent[i].className = 'skillsContent skills_close'
    }
    if(itemClass === 'skillsContent skills_close'){
    this.parentNode.className = 'skillsContent skills_open'
    }
    }
    skillsHeader.forEach((el)=>{
    el.addEventListener('click',toggleSkills)
    })
    
    
    // <!----------------------------Qualification JavaScript----------------------->
    var tabBtns = document.getElementsByClassName("qualification__Button");
    var tabContents = document.getElementsByClassName("qualificationContent");
    
    function openTab(tabname){
    for(tabBtn of tabBtns){
        tabBtn.classList.remove("quali_active");
    }
    for(tabContent of tabContents){
        tabContent.classList.remove("active-tab");
    }
    
    event.currentTarget.classList.add("quali_active");
    document.getElementById(tabname).classList.add("active-tab")
    
    }
    
    
        // <!------------About Section Part----------- -->
    
        var aboutLinks = document.getElementsByClassName("about-links");
    var aboutContents = document.getElementsByClassName("about-contents");
    
    function openAbout(tabname){
    
    for(aboutLink of aboutLinks){
        aboutLink.classList.remove("active");
    }
    for(aboutContent of aboutContents){
        aboutContent.classList.remove("active-tab");
    }
    
    event.currentTarget.classList.add("active");
    document.getElementById(tabname).classList.add("active-tab")
    }
    
    
    // <!----------------------Changing background Header--------------------->
    function scrollHeader(){
    let nav = document.getElementById('menu')
        header = document.getElementById('baseheader')
    if(this.scrollY>=80){
        nav.classList.add('scroll-header');
        
    } 
    else {
        nav.classList.remove('scroll-header');
        header.classList.remove('scroll-nav');
    
    }
    if(this.scrollY>=20){
        header.classList.add('scroll-nav');
    }
    }
    window.addEventListener('scroll',scrollHeader)
    
    // <!---------------------     Scroll Top      ----------------------->
    function scrollTop(){
    const scrollTop = document.getElementById('scroll_up');
    if(this.scrollY >= 260){
        scrollTop.classList.add('show-scroll');
    }
    else{
        scrollTop.classList.remove('show-scroll');
    }
    }
    window.addEventListener('scroll', scrollTop)
    
    
    // <!-------------------------     Dark mode       ------------------------------------->
    
    
    const body = document.querySelector('body');
    const darkToggle = document.getElementById('darkMode__Toggle');
    darkToggle.onclick = function(){
    body.classList.toggle('dark-theme');
    }
    
    
    // <!------------------------      Menu Active     ----------------->
    
    const menuLinks = document.querySelectorAll('.navMenu a');
    const menuLink = document.querySelectorAll('.navMenu a i');
    
    
    function updateActiveLink() {
    // Get the current scroll position
    const scrollPosition = window.scrollY;
    
    // Check which section is currently in view
    document.querySelectorAll('section').forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      // Remove 'active' class from all links
      menuLinks.forEach(link => link.classList.remove('active'));
      menuLink.forEach(link => link.classList.remove('active-mini'));
    
    
      // Add 'active' class to the corresponding link
      const correspondingLink = document.querySelector(`.navMenu a[href="#${section.id}"]`);
      const correspondingLinks = document.querySelector(`.navMenu a[href="#${section.id}"] i`);
    
      if (correspondingLink || correspondingLinks) {
        correspondingLink.classList.add('active');
        correspondingLinks.classList.add('active-mini');
    
      }
    }
    });
    }
    
    // Listen for scroll events
    window.addEventListener('scroll', updateActiveLink);
    
    // Initial update on page load
    updateActiveLink();
    
    // <!------------------------      About MOdal         ----------------------->
    
    const modalOpen = document.querySelectorAll('.about-modal'),
    modals = document.querySelectorAll('.modal'),
    modalBtns = document.querySelectorAll('.modalClicks'),
    modalClose = document.querySelectorAll('.about_modal-close')
    
    
    let modal = function(modalClick){
    modalOpen[modalClick].classList.add('active-modal'),
    modals[modalClick].classList.add('active-modals')
    }
    
    modalBtns.forEach((modalBtn, i) => {
    modalBtn.addEventListener('click',() =>{
    modal(i)
    })
    })
    
    modalClose.forEach((modalclr) => {
    modalclr.addEventListener('click',() =>{
    modalOpen.forEach((modalOpen)=>{
    modalOpen.classList.remove('active-modal')
    })
    modals.forEach((modals)=>{
    modals.classList.remove('active-modals')
    })
    })
    })
    
    // <!------------Animation Image----------->
    
    function scrollImage(){
    const scrollImage = document.getElementById('imageHome');
    if(this.scrollY >= 300){
        scrollImage.classList.add('image-scroll');
    }
    else{
        scrollImage.classList.remove('image-scroll');
    }
    }
    window.addEventListener('scroll', scrollImage)
    
    
    
    
   