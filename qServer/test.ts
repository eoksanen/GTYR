type CallsFunction = (callback: (result: number | string) => any) => void;

const func: CallsFunction = (cb) => {
  cb('done');
  cb(1);
}

func((result) => {

    console.log(result)
 // return result;
});