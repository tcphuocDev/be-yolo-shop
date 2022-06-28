export default function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

export function serilize(data) {
  if (data.length > 0) {
    const serilizeData = [];
    data.forEach((record) => {
      serilizeData[record.id] = record;
    });
    return serilizeData;
  }
  return data;
}
