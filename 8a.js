function vowelCount(input) {
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    const counts = { a: 0, e: 0, i: 0, o: 0, u: 0 };
  
    const str = input.toLowerCase();
    for (let char of str) {
      if (vowels.includes(char)) {
        counts[char]++;}
    }
  
    console.log(
      `a, e, i, o, and u appear, respectively: ${counts.a}, ${counts.e}, ${counts.i}, ${counts.o}, ${counts.u} times`
    );
  }
  
  vowelCount('Le Tour de France');