function add(str)
{
    var res = ""
    for(let i =0 ; i<str.length;i++)
{
    if("aeiou ".includes(str[i]))
    {
        res +=str[i];
    }
    else{
        res += str[i] + 'o' + str[i];
    }
}
return res;
}


console.log(add("that is good"));


