define([
],function(){

  const NODEJS = 5, 
        DATABASE = 2,
        PYTHON = 3,
        RUBY = 4,
        SCALA= 6,
        SHELL= 1;

  const getLang = (t) => {
    switch(t) {
      case SHELL: return 'batchfile';
      case SCALA: return 'scala';
      case RUBY : return 'ruby';
      case PYTHON: return 'python';
      case DATABASE: return 'sql';
      case NODEJS: return 'javascript'; 
    }

    return 'batchfile'; 
  };      

  return {
    NODEJS,
    DATABASE,
    PYTHON,
    RUBY,
    SCALA,
    SHELL,
    getLang
  };
});