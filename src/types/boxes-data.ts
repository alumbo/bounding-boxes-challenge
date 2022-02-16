interface CoordinatesType {
  x: number;
  y: number;
}
export interface BoxType {
  box: {
    bottomRight: CoordinatesType;
    topLeft: CoordinatesType;
  };
  time: number;
}
export interface AppearanceType {
  boxes: BoxType[];
}
export interface ProcessedAppearanceType {
  boxes: BoxType[];
  startTime: number;
  endTime: number;
  objectClass: ObjectClassType | string;
  id: string;
}
enum ObjectClassType {
  OBJECT_CLASS_PERSON = 'OBJECT_CLASS_PERSON',
  OBJECT_CLASS_CAR = 'OBJECT_CLASS_CAR'
}
interface BoxesObjectType {
  id: string;
  appearances: AppearanceType[];
  objectClass: ObjectClassType | string;
}
export interface BoxesDataType {
  analysis: { objects: BoxesObjectType[] };
}
