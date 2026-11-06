(function (root, f) {
  if (typeof module === 'object' && module.exports) module.exports = f();
  else root.LISTS = f();
})(this, function () {
  const DIV = [
    { name: 'Dhaka', d: ['Dhaka','Faridpur','Gazipur','Gopalganj','Kishorganj','Madaripur','Manikganj','Munshiganj','Narayanganj','Narsingdi','Rajbari','Shariatpur','Tangail'] },
    { name: 'Chattogram', d: ['Bandarban','Brahmanbaria','Chandpur','Chattogram',"Cox's Bazar",'Cumilla','Feni','Khagrachhari','Lakshmipur','Noakhali','Rangamati'] },
    { name: 'Sylhet', d: ['Habiganj','Moulvibazar','Sunamganj','Sylhet'] },
    { name: 'Barishal', d: ['Barguna','Barishal','Bhola','Jhalokati','Patuakhali','Pirojpur'] },
    { name: 'Khulna', d: ['Bagerhat','Chuadanga','Jashore','Jhenaidah','Khulna','Kushtia','Magura','Meherpur','Narail','Satkhira'] },
    { name: 'Rajshahi', d: ['Bogura','Chapai Nawabganj','Joypurhat','Naogaon','Natore','Pabna','Rajshahi','Sirajganj'] },
    { name: 'Rangpur', d: ['Dinajpur','Gaibandha','Kurigram','Lalmonirhat','Nilphamari','Panchagarh','Rangpur','Thakurgaon'] },
    { name: 'Mymensingh', d: ['Jamalpur','Mymensingh','Netrokona','Sherpur'] }
  ];
  // Names follow Natural Earth (world-atlas) spelling so they match the map.
  const CONT = [
    { name: 'Asia', c: ['Afghanistan','Armenia','Azerbaijan','Bahrain','Bangladesh','Bhutan','Brunei','Cambodia','China','Cyprus','Georgia','India','Indonesia','Iran','Iraq','Japan','Jordan','Kazakhstan','Kuwait','Kyrgyzstan','Laos','Lebanon','Malaysia','Maldives','Mongolia','Myanmar','Nepal','North Korea','Oman','Pakistan','Palestine','Philippines','Qatar','Saudi Arabia','Singapore','South Korea','Sri Lanka','Syria','Tajikistan','Thailand','Timor-Leste','Turkey','Turkmenistan','United Arab Emirates','Uzbekistan','Vietnam','Yemen'] },
    { name: 'Europe', c: ['Albania','Andorra','Austria','Belarus','Belgium','Bosnia and Herz.','Bulgaria','Croatia','Czechia','Denmark','Estonia','Finland','France','Germany','Greece','Hungary','Iceland','Ireland','Italy','Kosovo','Latvia','Liechtenstein','Lithuania','Luxembourg','Malta','Moldova','Monaco','Montenegro','Netherlands','North Macedonia','Norway','Poland','Portugal','Romania','Russia','San Marino','Serbia','Slovakia','Slovenia','Spain','Sweden','Switzerland','Ukraine','United Kingdom'] },
    { name: 'Africa', c: ['Algeria','Angola','Benin','Botswana','Burkina Faso','Burundi','Cabo Verde','Cameroon','Central African Rep.','Chad','Comoros','Congo',"Côte d'Ivoire",'Dem. Rep. Congo','Djibouti','Egypt','Eq. Guinea','Eritrea','eSwatini','Ethiopia','Gabon','Gambia','Ghana','Guinea','Guinea-Bissau','Kenya','Lesotho','Liberia','Libya','Madagascar','Malawi','Mali','Mauritania','Mauritius','Morocco','Mozambique','Namibia','Niger','Nigeria','Rwanda','São Tomé and Principe','Senegal','Seychelles','Sierra Leone','Somalia','South Africa','S. Sudan','Sudan','Tanzania','Togo','Tunisia','Uganda','Zambia','Zimbabwe'] },
    { name: 'North America', c: ['Antigua and Barb.','Bahamas','Barbados','Belize','Canada','Costa Rica','Cuba','Dominica','Dominican Rep.','El Salvador','Grenada','Guatemala','Haiti','Honduras','Jamaica','Mexico','Nicaragua','Panama','St. Kitts and Nevis','Saint Lucia','St. Vin. and Gren.','Trinidad and Tobago','United States of America'] },
    { name: 'South America', c: ['Argentina','Bolivia','Brazil','Chile','Colombia','Ecuador','Guyana','Paraguay','Peru','Suriname','Uruguay','Venezuela'] },
    { name: 'Oceania', c: ['Australia','Fiji','Kiribati','Marshall Is.','Micronesia','Nauru','New Zealand','Palau','Papua New Guinea','Samoa','Solomon Is.','Tonga','Tuvalu','Vanuatu'] }
  ];
  const MYG = [
    { name: 'Peninsular Malaysia', s: ['Johor','Kedah','Kelantan','Melaka','Negeri Sembilan','Pahang','Penang','Perak','Perlis','Selangor','Terengganu'] },
    { name: 'East Malaysia', s: ['Sabah','Sarawak'] },
    { name: 'Federal Territories', s: ['Kuala Lumpur','Labuan','Putrajaya'] }
  ];
  return {
    DIV, CONT, MYG,
    STATES: MYG.flatMap(g => g.s),
    DISTRICTS: DIV.flatMap(d => d.d),
    COUNTRIES: CONT.flatMap(c => c.c)
  };
});