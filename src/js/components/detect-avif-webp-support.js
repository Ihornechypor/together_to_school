export const detectAvifWebPSupport = {
  init: function () {
    !(function (document) {
      let formatsArr = [
        {
          ext: 'avif',
          example:
            'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUEAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAF0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgS0AAAAAABNjb2xybmNseAACAAIAAIAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAGVtZGF0EgAKBzgAPtAgIAkyUBAAAPWc41TP///4gHBX9H8XVK7gGeDllq8TYARA+8Tfsv7L+zPE24eIoIzE0WhHbrqcrTK9VEgEG/hwgB5rdCbvP8g3KYPdV88CvPJnptgQ'
        },
        {
          ext: 'webp',
          example:
            'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
        }
      ];
      let supportArr = [];

      const addClass = () => {
        const el = document.documentElement;
        let counter = 0;

        supportArr.forEach((item) => {
          if (item.hasSupport) {
            counter++;
          }
        });

        if (counter === 2) {
          el.classList.add('has-avif-webp-support');
        } else if (counter === 1) {
          el.classList.add('has-webp-only-support');
        } else if (counter === 0) {
          el.classList.add('no-avif-webp-support');
        }
      };

      const addSupport = (format, support) => {
        supportArr.push({ extension: format, hasSupport: support });

        if (formatsArr.length === supportArr.length) {
          addClass();
        }
      };

      const testFormat = (format, imageSrc, callback) => {
        let image = new Image();
        return (
          (image.onload = image.onerror =
            () => {
              callback(format, 2 === image.height);
            }),
          void (image.src = imageSrc)
        );
      };

      formatsArr.forEach((format) => {
        testFormat(format.ext, format.example, addSupport);
      });
    })(document);
  }
};
